import { Request, Response } from 'express';
import crypto from 'crypto';
import { dbBlogPosts } from '../db/index.js';
import { BlogPost } from '../db/schema.js';
import { validateBlogPostData, slugify } from '../utils/validators.js';

export async function getBlogPosts(req: Request, res: Response): Promise<void> {
  try {
    let posts = await dbBlogPosts.getAll();

    const { search } = req.query;

    posts = posts.filter(p => p.published);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      posts = posts.filter(
        p => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: posts.length, posts });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve blog posts.' });
  }
}

export async function getBlogPostByIdOrSlug(req: Request, res: Response): Promise<void> {
  try {
    const { idOrSlug } = req.params;
    const post = await dbBlogPosts.getByIdOrSlug(idOrSlug);

    if (!post) {
      res.status(404).json({ success: false, message: 'Blog post not found.' });
      return;
    }

    res.json({ success: true, post });
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve blog post.' });
  }
}

export async function createBlogPost(req: Request, res: Response): Promise<void> {
  try {
    const validationError = validateBlogPostData(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const title = req.body.title.trim();
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id: req.body.id || `post_${crypto.randomBytes(8).toString('hex')}`,
      title,
      shortDescription: req.body.shortDescription || '',
      content: req.body.content,
      featuredImage: req.body.featuredImage || '',
      slug,
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
      uploadDate: req.body.uploadDate || now.split('T')[0],
      displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) : 0,
      createdAt: now,
      updatedAt: now,
    };

    const created = await dbBlogPosts.create(newPost);
    res.status(201).json({ success: true, message: 'Blog post created successfully.', post: created });
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ success: false, message: 'Failed to create blog post.' });
  }
}

export async function updateBlogPost(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (req.body.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
    }

    const updated = await dbBlogPosts.update(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Blog post not found.' });
      return;
    }

    res.json({ success: true, message: 'Blog post updated successfully.', post: updated });
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ success: false, message: 'Failed to update blog post.' });
  }
}

export async function deleteBlogPost(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await dbBlogPosts.delete(id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Blog post not found.' });
      return;
    }

    res.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).json({ success: false, message: 'Failed to delete blog post.' });
  }
}
