import { promises as fs } from 'fs';
import path from 'path';

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const blogsDirectory = path.join(process.cwd(), 'app', 'blog');
  const blogSlugs = await getNoteSlugs(blogsDirectory);

   const projectsDirectory = path.join(process.cwd(), 'app', 'projects');
  const projectsSlugs = await getNoteSlugs(projectsDirectory);

  const blogs = blogSlugs.map((slug) => ({
    url: `https://akashgirme.com/blog/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = ['', '/work'].map((route) => ({
    url: `https://akashgirme.com${route}`,
    lastModified: new Date().toISOString(),
  }));

   const projects = projectsSlugs.map((slug) => ({
    url: `https://akashgirme.com/projects/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogs, ...projects];
}
