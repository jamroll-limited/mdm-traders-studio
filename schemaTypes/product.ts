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
    defineField({
      name: 'mainCategory',
      title: 'Main Category',
      type: 'string',
      options: {
        list: [
          { title: 'Portable Radio', value: 'portable-radio' },
          { title: 'Mobile Radio', value: 'mobile-radio' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      options: {
        list: [
          { title: 'APX', value: 'apx' },
          { title: 'MOTOTRBO', value: 'mototrbo' },
          { title: 'TETRA', value: 'tetra' },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Select the product sub-category (APX, MOTOTRBO, or TETRA)',
    }),
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
      description: 'Complete product details including Features, Technical Specs, etc. Use headings (H2, H3, H4) for section titles. Press Enter twice to create paragraph breaks.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
      mainCategory: 'mainCategory',
      subCategory: 'subCategory',
    },
    prepare(selection) {
      const { title, images, mainCategory, subCategory } = selection

      // Find main image or use first image
      const mainImage = images?.find((img: any) => img.isMainImage) || images?.[0]

      // Format category labels
      const formatCategory = (cat: string) => {
        if (!cat) return '';
        return cat.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }

      const categoryLabel = subCategory
        ? `${formatCategory(mainCategory)} - ${subCategory.toUpperCase()}`
        : formatCategory(mainCategory) || 'Uncategorized'

      return {
        title: title,
        subtitle: categoryLabel,
        media: mainImage,
      }
    },
  },
})