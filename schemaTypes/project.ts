import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
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
            description: 'Click "Generate" to auto-create from project title',
        }),
        defineField({
            name: 'description',
            title: 'Project Description',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
            description: 'Brief description of the project (2-3 sentences)',
        }),
        defineField({
            name: 'category',
            title: 'Project Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Completed', value: 'completed' },
                    { title: 'In Progress', value: 'in-progress' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'contractDate',
            title: 'Contract Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
            description: 'Date when the contract was signed',
            options: {
                dateFormat: 'DD/MM/YYYY',
            },
        }),
        defineField({
            name: 'location',
            title: 'Project Location',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Where the project is being implemented',
        }),
        defineField({
            name: 'client',
            title: 'Client Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Name of the client/organization',
        }),
        defineField({
            name: 'image',
            title: 'Project Image',
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
            ],
            validation: (Rule) => Rule.required(),
            description: 'Main project image (recommended: 1200x800px)',
        }),
        defineField({
            name: 'fullDescription',
            title: 'Full Project Details (Optional)',
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
            description: 'Detailed project information (optional, for future project detail pages)',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            client: 'client',
            image: 'image',
        },
        prepare(selection) {
            const { title, category, client, image } = selection

            const statusLabel = category === 'completed' ? '✅ Completed' : '🚧 In Progress'

            return {
                title: title,
                subtitle: `${statusLabel} - ${client}`,
                media: image,
            }
        },
    },
    orderings: [
        {
            title: 'Sort Order',
            name: 'sortOrder',
            by: [
                { field: 'sortOrder', direction: 'asc' },
                { field: '_createdAt', direction: 'desc' }
            ]
        },
        {
            title: 'Contract Date (Newest First)',
            name: 'contractDateDesc',
            by: [{ field: 'contractDate', direction: 'desc' }]
        },
        {
            title: 'Contract Date (Oldest First)',
            name: 'contractDateAsc',
            by: [{ field: 'contractDate', direction: 'asc' }]
        },
    ],
})