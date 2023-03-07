import { Action, ActionPanel, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useNode, useNodeTopics } from "./api/hooks";
import TopicDetail from "./components/TopicDetail";
import { getNodes } from "./utils/preference";
import { useEffect, useRef } from "react";
import { getUnixFromNow } from "./utils/time";
export default function Command() {
  const nodes = getNodes();

  const [showDetails, setShowDetails] = useCachedState("topic-show-details", false);
  const [nodeName, setNodeName] = useCachedState("selected-node-name", nodes[0]);

  const node = useNode(nodeName);
  const topics = useNodeTopics(nodeName);
  return (
    <List
      isShowingDetail={showDetails}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Node"
          value={nodeName}
          defaultValue={nodeName}
          onChange={(n) => {
            setNodeName(n);
          }}
        >
          <List.Dropdown.Section title="Node">
            {nodes.map((node) => {
              return <List.Dropdown.Item key={node} title={node.toUpperCase()} value={node} />;
            })}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {topics.data?.map((topic) => (
        <List.Item
          actions={
            <ActionPanel>
              <Action
                title={showDetails ? "Hide Details" : "Show Details"}
                onAction={() => setShowDetails((x) => !x)}
              />
              <Action.OpenInBrowser url={topic.url} />
            </ActionPanel>
          }
          subtitle={{ value: !showDetails ? getUnixFromNow(topic.last_touched) : null, tooltip: "Last touched" }}
          key={topic.id}
          title={topic.title}
          id={String(topic.id)}
          icon={node.data?.avatar}
          accessories={[{ tag: String(topic.replies), tooltip: "Replies" }]}
          detail={<TopicDetail topic={topic} />}
        />
      ))}
    </List>
  );
}
