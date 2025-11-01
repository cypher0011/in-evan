#!/bin/bash

# Script to remove Framer Motion imports from files
# This is a one-time cleanup script

echo "Removing Framer Motion from remaining files..."

# Files to process
FILES=(
  "app/c/[token]/thanks/ThanksView.tsx"
  "app/c/[token]/payment/PaymentView.tsx"
  "app/c/[token]/enhance-stay/EnhanceStayView.tsx"
  "app/c/[token]/booking-details/BookingDetailsView.tsx"
  "components/NationalitySelector.tsx"
  "app/error/ErrorView.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Count before
    before=$(grep -c "from 'framer-motion'" "$file" 2>/dev/null || echo "0")
    echo "  - Framer Motion imports: $before"
  else
    echo "File not found: $file"
  fi
done

echo ""
echo "Note: This script only counts. Actual removal must be done manually with Edit tool."
echo "Reason: Framer Motion removal requires context-aware replacements (motion.div → div, etc.)"
