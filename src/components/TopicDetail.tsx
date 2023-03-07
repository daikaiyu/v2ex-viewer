import { List } from "@raycast/api";
import { Topic } from "../api/types";
import { getTopicMarkdownContent } from "../utils/markdown";
import { useTopic, useTopicReplies } from "../api/hooks";
interface TopicDetailProps {
  topic: Omit<Topic, "member" | "node">;
}
const TopicDetail = (props: TopicDetailProps) => {
  const topic = useTopic(props.topic.id, { initialData: props.topic });
  const replies = useTopicReplies(props.topic.id);
  return (
    <List.Item.Detail
      isLoading={topic.isLoading || replies.isLoading}
      markdown={getTopicMarkdownContent({
        topic: topic.data || topic,
        node: topic.data?.node,
        member: topic.data?.member,
        replies: replies.data || [],
      })}
    />
  );
};

export default TopicDetail;
