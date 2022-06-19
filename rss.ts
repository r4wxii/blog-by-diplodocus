import { parse } from "https://deno.land/x/frontmatter@v0.1.4/mod.ts";
import { Feed } from "https://esm.sh/feed@4.2.2";
import { Post } from "./types/Post.d.ts";
import { MyFrontMatter } from "./types/MyFrontMatter.d.ts";

{
  const posts = [];
  for await (const post of Deno.readDir(`docs/entry`)) {
    if (post.isFile && post.name.endsWith(".md")) {
      posts.push(post);
    }
  }

  const feed = new Feed({
    id: "",
    title: "No one knows unknowns",
    link: "https://blog.r4wxii.com",
    copyright: "r4wxii",
    description: "r4wxiiのブログ",
  });

  const parsedPosts: Post[] = [];
  for await (const post of posts) {
    const content = await Deno.readFile(`./docs/entry/${post.name}`);
    const text = new TextDecoder().decode(content);
    const parsed = parse(text);
    if (isFrontMatter(parsed.data)) {
      const myfrontMatter = {
        ...parsed.data,
        content: parsed.content.split(/\n/)[0],
      };
      parsedPosts.push({
        fileName: post.name.replace(".md", ""),
        frontMatter: myfrontMatter,
      });
    }
  }
  parsedPosts.sort((post1, post2) =>
    compareDate(post1.frontMatter.date, post2.frontMatter.date)
  ).slice(0, 5).forEach((post) => {
    feed.addItem({
      title: post.frontMatter.title,
      link: `htpps://blog.r4wxii.com/entry/${post.fileName}`,
      date: post.frontMatter.date,
      image: post.frontMatter.image,
      description: post.frontMatter.description,
      content: post.frontMatter.content,
    });
  });

  await Deno.writeTextFile("./docs/rss.xml", feed.rss2());
}

function isFrontMatter(arg: unknown): arg is MyFrontMatter {
  return typeof arg === "object" &&
    arg !== null &&
    typeof (arg as MyFrontMatter).title === "string" &&
    (arg as MyFrontMatter).date instanceof Date;
}

function compareDate(date1: Date, date2: Date): number {
  if (date1 > date2) {
    return -1;
  } else if (date1 < date2) {
    return 1;
  } else {
    return 0;
  }
}
