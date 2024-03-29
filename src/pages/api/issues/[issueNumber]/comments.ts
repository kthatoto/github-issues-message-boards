import { NextApiRequest, NextApiResponse } from "next";

import { Comment } from "@/pages/api/issues/[issueNumber]";
import { graphqlClient } from "@/utils/graphqlClient";

type CreateCommentResponse = {
  addComment: {
    commentEdge: {
      node: Comment;
    };
  };
};

const createCommentMutation = `
mutation ($issueId: ID!, $body:String!) {
  addComment(input: { subjectId: $issueId, body: $body }) {
    commentEdge {
      node {
        id
        bodyText
        createdAt
      }
    }
  }
}
`;

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { issueId, body } = req.body;
  if (!issueId || !body) {
    return res.status(400).end();
  }
  const createCommentResponse = await graphqlClient<CreateCommentResponse>(createCommentMutation, {
    issueId,
    body,
  });
  return res.status(201).json(createCommentResponse.addComment.commentEdge.node);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await post(req, res);
  } else {
    return res.status(405).end();
  }
}
