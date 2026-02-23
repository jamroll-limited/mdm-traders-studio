import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'Click "Generate" to auto-create from product name',
    }),

    // ─── MAIN CATEGORY ───────────────────────────────────────────────────────
    defineField({
      name: 'mainCategory',
      title: 'Main Category',
      type: 'string',
      options: {
        list: [
          { title: 'Portable Radio', value: 'portable-radio' },
          { title: 'Mobile Radio', value: 'mobile-radio' },
          { title: 'Body Camera', value: 'body-camera' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── SUB CATEGORY (Level 2) ───────────────────────────────────────────────
    // For Portable/Mobile Radio: APX, MOTOTRBO, TETRA
    // For Accessories: MOTOTRBO Two-Way Radios, Consumer Two-Way Radios
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      options: {
        list: [
          // Portable / Mobile Radio sub-categories
          { title: 'APX', value: 'apx' },
          { title: 'MOTOTRBO', value: 'mototrbo' },
          { title: 'TETRA', value: 'tetra' },
          // Accessories sub-categories
          { title: 'MOTOTRBO Two-Way Radios', value: 'mototrbo-two-way-radios' },
          { title: 'Consumer Two-Way Radios', value: 'consumer-two-way-radios' },
        ],
      },
      validation: (Rule) =>
        Rule.custom((subCategory, context) => {
          const doc = context.document as any
          const mainCategory = doc?.mainCategory

          if (mainCategory === 'body-camera') return true

          if (mainCategory === 'portable-radio' || mainCategory === 'mobile-radio') {
            const radioSubs = ['apx', 'mototrbo', 'tetra']
            if (!subCategory || !radioSubs.includes(subCategory)) {
              return 'Portable Radio and Mobile Radio products require a sub-category (APX, MOTOTRBO, or TETRA)'
            }
          }

          if (mainCategory === 'accessories') {
            const accessorySubs = ['mototrbo-two-way-radios', 'consumer-two-way-radios']
            if (!subCategory || !accessorySubs.includes(subCategory)) {
              return 'Accessories products require a sub-category (MOTOTRBO Two-Way Radios or Consumer Two-Way Radios)'
            }
          }

          return true
        }),
      description:
        'For Portable/Mobile Radio: APX, MOTOTRBO, TETRA. For Accessories: MOTOTRBO Two-Way Radios or Consumer Two-Way Radios.',
      hidden: ({ document }) => document?.mainCategory === 'body-camera',
    }),

    // ─── SUB-SUB CATEGORY (Level 3) ───────────────────────────────────────────
    // Shown only for Accessories
    // • MOTOTRBO Two-Way Radios → Batteries | Charger Accessories | Portable Radios Accessories | Audio Accessories
    // • Consumer Two-Way Radios → BATTERIES AND CHARGERS | HEADPHONES... | CASES...
    defineField({
      name: 'subSubCategory',
      title: 'Sub-Sub Category',
      type: 'string',
      options: {
        list: [
          // Under MOTOTRBO Two-Way Radios
          { title: 'Batteries', value: 'batteries' },
          { title: 'Charger Accessories', value: 'charger-accessories' },
          { title: 'Portable Radios Accessories', value: 'portable-radios-accessories' },
          { title: 'Audio Accessories', value: 'audio-accessories' },
          // Under Consumer Two-Way Radios
          { title: 'Batteries and Chargers', value: 'batteries-and-chargers' },
          { title: 'Headphones, Earpieces and Microphones', value: 'headphones-earpieces-microphones' },
          { title: 'Cases and Carry Accessories', value: 'cases-and-carry-accessories' },
        ],
      },
      validation: (Rule) =>
        Rule.custom((subSubCategory, context) => {
          const doc = context.document as any
          const mainCategory = doc?.mainCategory
          const subCategory = doc?.subCategory

          if (mainCategory !== 'accessories') return true

          // Validate correct sub-sub options for each subCategory
          if (subCategory === 'mototrbo-two-way-radios') {
            const valid = ['batteries', 'charger-accessories', 'portable-radios-accessories', 'audio-accessories']
            if (subSubCategory && !valid.includes(subSubCategory)) {
              return 'Please select a valid sub-sub-category for MOTOTRBO Two-Way Radios'
            }
          }

          if (subCategory === 'consumer-two-way-radios') {
            const valid = ['batteries-and-chargers', 'headphones-earpieces-microphones', 'cases-and-carry-accessories']
            if (subSubCategory && !valid.includes(subSubCategory)) {
              return 'Please select a valid sub-sub-category for Consumer Two-Way Radios'
            }
            if (!subSubCategory) {
              return 'Consumer Two-Way Radios products require a sub-sub-category'
            }
          }

          return true
        }),
      description:
        'Select the deeper category. Optional for MOTOTRBO Two-Way Radios (product can sit directly under it). Required for Consumer Two-Way Radios.',
      hidden: ({ document }) => document?.mainCategory !== 'accessories',
    }),

    // ─── SUB-SUB-SUB CATEGORY (Level 4) ──────────────────────────────────────
    // Shown only when subSubCategory is one of the two that have deeper levels:
    //   • Charger Accessories → Multi-Unit Chargers | Single-Unit Chargers
    //   • Portable Radios Accessories → 800M - Antenna | Adapters for Antennas | UHF Antenna for Portable Radios
    //   • Audio Accessories → Ear Microphone Solutions | Earsets and Earpieces | Headsets
    defineField({
      name: 'subSubSubCategory',
      title: 'Sub-Sub-Sub Category',
      type: 'string',
      options: {
        list: [
          // Under Charger Accessories
          { title: 'Multi-Unit Chargers', value: 'multi-unit-chargers' },
          { title: 'Single-Unit Chargers', value: 'single-unit-chargers' },
          // Under Portable Radios Accessories
          { title: '800M - Antenna', value: '800m-antenna' },
          { title: 'Adapters for Antennas', value: 'adapters-for-antennas' },
          { title: 'UHF Antenna for Portable Radios', value: 'uhf-antenna-portable-radios' },
          // Under Audio Accessories
          { title: 'Ear Microphone Solutions', value: 'ear-microphone-solutions' },
          { title: 'Earsets and Earpieces', value: 'earsets-and-earpieces' },
          { title: 'Headsets', value: 'headsets' },
        ],
      },
      validation: (Rule) =>
        Rule.custom((subSubSubCategory, context) => {
          const doc = context.document as any
          const subSubCategory = doc?.subSubCategory

          // Validate correct options per subSubCategory
          if (subSubCategory === 'charger-accessories') {
            const valid = ['multi-unit-chargers', 'single-unit-chargers']
            if (subSubSubCategory && !valid.includes(subSubSubCategory)) {
              return 'Please select Multi-Unit Chargers or Single-Unit Chargers'
            }
          }

          if (subSubCategory === 'portable-radios-accessories') {
            const valid = ['800m-antenna', 'adapters-for-antennas', 'uhf-antenna-portable-radios']
            if (!subSubSubCategory || !valid.includes(subSubSubCategory)) {
              return 'Portable Radios Accessories requires a sub-sub-sub-category (Antenna type)'
            }
          }

          if (subSubCategory === 'audio-accessories') {
            const valid = ['ear-microphone-solutions', 'earsets-and-earpieces', 'headsets']
            if (!subSubSubCategory || !valid.includes(subSubSubCategory)) {
              return 'Audio Accessories requires a sub-sub-sub-category (Audio type)'
            }
          }

          return true
        }),
      description:
        'Deepest level. Required for Portable Radios Accessories and Audio Accessories. Optional for Charger Accessories (product can sit directly under it).',
      hidden: ({ document }) => {
        const sub2 = document?.subSubCategory as string | undefined
        // Only show for subSubCategories that have a deeper level
        return !['charger-accessories', 'portable-radios-accessories', 'audio-accessories'].includes(sub2 ?? '')
      },
    }),

    // ─── IMAGES ───────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'isMainImage',
              type: 'boolean',
              title: 'Set as Main Image',
              description: 'Mark this as the main product image',
              initialValue: false,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
      description: 'Add 5-6 or more product images. Mark one as the main image.',
    }),

    // ─── DESCRIPTIONS ─────────────────────────────────────────────────────────
    defineField({
      name: 'cardDescription',
      title: 'Short Description (For Product Card)',
      type: 'text',
      rows: 3,
      description: 'Brief description shown on product cards in listings (1-2 sentences, ~50-80 characters)',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description (Under Title)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H5', value: 'h5' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
      description:
        'Rich text shown under the product title on the detail page (2–3 short paragraphs recommended)',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description & Details',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
      description:
        'Complete product details including Features, Technical Specs, etc. Use headings (H2, H3, H4) for section titles. Press Enter twice to create paragraph breaks.',
    }),
  ],

  // ─── PREVIEW ──────────────────────────────────────────────────────────────
  preview: {
    select: {
      title: 'title',
      images: 'images',
      mainCategory: 'mainCategory',
      subCategory: 'subCategory',
      subSubCategory: 'subSubCategory',
      subSubSubCategory: 'subSubSubCategory',
    },
    prepare(selection) {
      const { title, images, mainCategory, subCategory, subSubCategory, subSubSubCategory } = selection

      // Find main image or use first image
      const mainImage = images?.find((img: any) => img.isMainImage) || images?.[0]

      const labelMap: Record<string, string> = {
        'portable-radio': 'Portable Radio',
        'mobile-radio': 'Mobile Radio',
        'body-camera': 'Body Camera',
        'accessories': 'Accessories',
        'apx': 'APX',
        'mototrbo': 'MOTOTRBO',
        'tetra': 'TETRA',
        'mototrbo-two-way-radios': 'MOTOTRBO Two-Way Radios',
        'consumer-two-way-radios': 'Consumer Two-Way Radios',
        'batteries': 'Batteries',
        'charger-accessories': 'Charger Accessories',
        'portable-radios-accessories': 'Portable Radios Accessories',
        'audio-accessories': 'Audio Accessories',
        'batteries-and-chargers': 'Batteries and Chargers',
        'headphones-earpieces-microphones': 'Headphones, Earpieces and Microphones',
        'cases-and-carry-accessories': 'Cases and Carry Accessories',
        'multi-unit-chargers': 'Multi-Unit Chargers',
        'single-unit-chargers': 'Single-Unit Chargers',
        '800m-antenna': '800M - Antenna',
        'adapters-for-antennas': 'Adapters for Antennas',
        'uhf-antenna-portable-radios': 'UHF Antenna for Portable Radios',
        'ear-microphone-solutions': 'Ear Microphone Solutions',
        'earsets-and-earpieces': 'Earsets and Earpieces',
        'headsets': 'Headsets',
      }

      const label = (val: string) => labelMap[val] ?? val ?? ''

      const parts = [
        label(mainCategory),
        label(subCategory),
        label(subSubCategory),
        label(subSubSubCategory),
      ].filter(Boolean)

      return {
        title,
        subtitle: parts.join(' › '),
        media: mainImage,
      }
    },
  },
})