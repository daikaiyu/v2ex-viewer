import { Topic, Reply, Member, Node } from "../api/types";
import { getUnixFromNow } from "./time";

const SEPARATOR = `\n\n------\n\n`;
const LINE_BREAK = `\n\n`;
const Code = (content: string) => `\`${content}\``;
const Bold = (content: string) => `**${content}**`;
const Link = (title: string, url: string) => `[${title}](${url})`;
const LOADING = Code("Loading...");
const Heading = (level: number, content: string) => {
  level = Math.max(1, Math.min(6, level));
  return `${"#".repeat(level)} ${content}`;
};

const OP = (isOP: boolean) => {
  return isOP ? ` ${Code("OP")} ` : "";
};

const getTopicMarkdownContent = (data: {
  topic: Omit<Topic, "member" | "node">;
  member?: Member;
  node?: Node;
  replies: Reply[];
}) => {
  const { topic, member, node, replies } = data;
  const topicTitle = `${Heading(1, topic.title)}`;

  const topicMember =
    node &&
    member &&
    `${Code(node.title)} · ${Bold(Link(member.username, member.url))} · ${getUnixFromNow(topic.created)}`;

  const topicHeader = `${topicTitle}${LINE_BREAK}${topicMember}`;

  const topicContent = `${topic.content}`;

  const repliesContent =
    replies.length > 0
      ? replies
          .map((reply) => getReplyMarkdownContent(reply, member ? member.id === reply.member.id : false))
          .join(LINE_BREAK)
      : "> No Comments Yet";

  return [topicHeader, topicContent, repliesContent].join(SEPARATOR);
};

const getReplyMarkdownContent = (reply: Reply, isOP = false) => {
  const replyMember = `${Bold(Link(reply.member.username, reply.member.url))} ${OP(isOP)} ${getUnixFromNow(
    reply.created
  )}`;
  const replyContent = `${reply.content}`;
  return `${replyMember}${LINE_BREAK}${replyContent}`;
};

export { getTopicMarkdownContent, getReplyMarkdownContent };
