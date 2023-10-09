import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { GraphEdge } from "src/types";
import { db } from "../firebase";
import { useEdgeStore } from "src/stores/edgeStore";

/**
 * Custom hook to fetch and store graph edges from Firebase Firestore based on graphId.
 *
 * @param {string | undefined} graphId - The ID of the graph to filter edges by.
 * @returns {GraphEdge[]} edges - Array of graph edges.
 * @returns {boolean} loading - Indicates whether the data is still loading.
 * @returns {Error | null} error - Contains the error if something went wrong, otherwise null.
 */
export const useEdges = (graphId?: string) => {
  const { edges, setEdges } = useEdgeStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!graphId) {
      setLoading(false);
      return;
    }

    const edgesCollection = collection(db, "edges");
    const q = query(edgesCollection, where("graphId", "==", graphId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEdges: GraphEdge[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data() as GraphEdge;
          fetchedEdges.push({ ...data, id: doc.id });
        });

        setEdges(fetchedEdges);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [graphId, setEdges]);

  return { edges, loading, error };
};
