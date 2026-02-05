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
          { title: 'Motorola Solutions', value: 'motorola-solutions' },
          { title: 'Cambium Networks', value: 'cambium-networks' },
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
          { title: 'APX Series', value: 'apx-series' },
          { title: 'Talkabout', value: 'talkabout' },
          { title: 'TETRA', value: 'tetra' },
          { title: 'MOTOTRBO', value: 'mototrbo' },
          { title: 'None (for Cambium Networks)', value: 'none' },
        ],
      },
      description: 'Only for Motorola Solutions products. Select "None" for Cambium Networks.',
      hidden: ({ document }) => document?.mainCategory !== 'motorola-solutions',
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
      name: 'shortDescription',
      title: 'Short Description (Under Title)',
      type: 'text',
      rows: 4,
      description: 'Brief description shown under the product title (2-3 sentences)',
      validation: (Rule) => Rule.required(),
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
      description: 'Use headings (H2, H3, H4) for section titles. Press Enter twice to create paragraph breaks.',
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

      const categoryLabel = subCategory && subCategory !== 'none'
        ? subCategory
        : mainCategory || 'Uncategorized'

      return {
        title: title,
        subtitle: categoryLabel,
        media: mainImage,
      }
    },
  },
})