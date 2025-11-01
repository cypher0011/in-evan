import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const orderSchema = z.object({
  hotelId: z.string().uuid(),
  lastName: z.string().min(2, 'Last name is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'At least one item is required'),
  notes: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    const { hotelId, lastName, roomNumber, items, notes } = validation.data;

    // Verify that the guest exists with the provided last name and room number
    const guest = await prisma.guest.findFirst({
      where: {
        hotelId,
        lastName: {
          equals: lastName,
          mode: 'insensitive',
        },
        roomNumber,
        status: 'Checked In',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!guest) {
      return NextResponse.json(
        {
          error:
            'Guest not found or not checked in. Please verify your last name and room number.',
        },
        { status: 403 }
      );
    }

    // Fetch the minibar items to calculate the correct total
    const minibarItems = await prisma.minibarItem.findMany({
      where: {
        id: {
          in: items.map((i) => i.itemId),
        },
        hotelId,
        isVisible: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
      },
    });

    // Validate stock availability
    for (const orderItem of items) {
      const dbItem = minibarItems.find((i) => i.id === orderItem.itemId);
      if (!dbItem) {
        return NextResponse.json(
          { error: `Item ${orderItem.itemId} not found or not available` },
          { status: 400 }
        );
      }
      if (dbItem.stockQuantity < orderItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbItem.name}` },
          { status: 400 }
        );
      }
    }

    // Create the order with items in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          hotelId,
          guestId: guest.id,
          guestLastName: lastName,
          roomNumber,
          source: 'minibar',
          status: 'Pending',
          notes: notes || null,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      // Create order items
      const orderItemsData = items.map((orderItem) => {
        const dbItem = minibarItems.find((i) => i.id === orderItem.itemId);
        return {
          orderId: order.id,
          minibarItem: orderItem.itemId,
          nameSnapshot: dbItem!.name,
          priceSnapshot: dbItem!.price,
          quantity: orderItem.quantity,
          lineTotal: Number(dbItem!.price) * orderItem.quantity,
        };
      });

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // Decrement stock for each item
      for (const orderItem of items) {
        await tx.minibarItem.update({
          where: { id: orderItem.itemId },
          data: {
            stockQuantity: {
              decrement: orderItem.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(
      {
        id: newOrder.id,
        createdAt: newOrder.createdAt,
        message: 'Order placed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error placing minibar order:', error);
    return NextResponse.json(
      { error: 'Failed to place order. Please try again.' },
      { status: 500 }
    );
  }
}
