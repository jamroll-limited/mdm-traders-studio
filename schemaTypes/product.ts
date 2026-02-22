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
          { title: 'Body Camera', value: 'body-camera' },
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
          { title: 'None (for Body Camera)', value: 'none' },
        ],
      },
      validation: (Rule) => 
        Rule.custom((subCategory, context) => {
          const mainCategory = (context.document as any)?.mainCategory;
          
          // If main category is Body Camera, subCategory must be 'none' or empty
          if (mainCategory === 'body-camera') {
            if (subCategory && subCategory !== 'none') {
              return 'Body Camera products should have "None" as sub-category';
            }
          }
          
          // If main category is Portable/Mobile Radio, subCategory is required
          if (mainCategory === 'portable-radio' || mainCategory === 'mobile-radio') {
            if (!subCategory || subCategory === 'none') {
              return 'Portable Radio and Mobile Radio products require a sub-category (APX, MOTOTRBO, or TETRA)';
            }
          }
          
          return true;
        }),
      description: 'Select sub-category for Portable/Mobile Radio products. Select "None" for Body Camera products.',
      hidden: ({ document }) => document?.mainCategory === 'body-camera',
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

      // Build category label
      let categoryLabel = formatCategory(mainCategory) || 'Uncategorized';
      
      // Add subCategory if it exists and is not 'none'
      if (subCategory && subCategory !== 'none') {
        categoryLabel = `${categoryLabel} - ${subCategory.toUpperCase()}`;
      }

      return {
        title: title,
        subtitle: categoryLabel,
        media: mainImage,
      }
    },
  },
})