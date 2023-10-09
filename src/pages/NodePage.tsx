import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  addEdge,
  fetchMarkdown,
  updateNodeTitle,
  uploadMarkdown,
} from "src/handles";
import { Spin, Typography } from "antd";
import { debounce } from "lodash";
import { useEdges } from "src/hooks/useEdges";
import { findNodeId } from "src/utils";
import { useNodes } from "src/hooks/useNodes";
import EditorArea from "src/components/Editor";


const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>();
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const { edges } = useEdges(graphId);
  const { nodes } = useNodes(graphId);

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  


  useEffect(() => {
    if (!nodeId || !graphId) return;
    const fetchMarkdownAsync = async (nodeId: string) => {
      setIsLoading(true);
      const md = await fetchMarkdown(nodeId);
      if (md) setMarkdownContent(md);
      setIsLoading(false);
    };
    fetchMarkdownAsync(nodeId);
  }, [graphId, nodeId]);

  useEffect(() => {
    const regex = /\[\[([^\]]+)\]\]/g;
    let match;
    const foundMatches: string[] = [];

    while ((match = regex.exec(markdownContent)) !== null) {
      foundMatches.push(match[1]);
    }

    const addNewEdges = async () => {
      for (const newEdge of foundMatches) {
        const targetId = findNodeId(nodes, newEdge);
        if (graphId && nodeId && targetId) {
          await addEdge(graphId, nodeId, targetId);
        }
      }
    };

    addNewEdges();
  }, [markdownContent, edges, nodes, nodeId, graphId]);

  const handleClickInside = () => {
    setIsEditing(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      editorRef.current &&
      !editorRef.current.contains(event.target as Node)
    ) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const cleanString = markdownContent
      .split("\n")[0]
      .replace(/[*_#`~]/g, "")
      .trim();
    const truncatedTitle = truncate(cleanString, 50);
    if (nodeId) {
      updateNodeTitle(nodeId, truncatedTitle);
    }
  }, [markdownContent, nodeId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // const delayedQuery = useMemo(() => debounce(() => {
  //   if (nodeId && markdownContent) {
  //     uploadMarkdown(nodeId, markdownContent);
  //   }
  // }, 2000), [nodeId, markdownContent]);

  // Create a memoized debounced function
  // const debouncedUpload = useCallback(
  //   debounce(() => {
  //     if (nodeId && markdownContent) {
  //       uploadMarkdown(nodeId, markdownContent);
  //     }
  //   }, 1000),
    // [nodeId, markdownContent]
  // );


  const debounceUpload = useCallback(
    debounce((newValue: string) => {
      if (nodeId && newValue) {
        console.log("uploading");
        uploadMarkdown(nodeId, newValue);
      }
    }, 1000),
    []
  );

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue);
      debounceUpload(newValue)
    }
  };


  return (
    <Typography>
      <div ref={editorRef} onClick={handleClickInside}>
        {isLoading ? (
          <Spin tip="Loading..."></Spin>
        ) : (
          <EditorArea
            isEditing={isEditing}
            markdownContent={markdownContent}
            handleEditorChange={handleEditorChange}
          />
        )}
      </div>
    </Typography>
  );
};

export default NodePage;
