"use client";
import 'dotenv/config';
import * as React from 'react';
import { useState, useEffect } from 'react';
import useSWR, {mutate} from 'swr';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Box, CircularProgress, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { deleteDocument, fetchDocuments } from '@/app/apiRequests'
import FeedbackAlert from '@/app/components/FeedbackAlert';

export default function DocumentList() {
  // router to be able to redirect between pages
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;
  // Fetch data from the API during the mount of the component
  const { data, error, isLoading } = useSWR(`${url}/documents`, fetchDocuments);
  const [documents, setDocuments] = useState([]);
  // to set the FeedbackAlert
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  // Use the useEffect hook to update the documents state whenever the data from useSWR changes
  useEffect(() => {
    if (data) {
      setDocuments(data);
    }
  }, [data]);
  // useSWR return values
  if (error) return <div>failed to load</div>;
  if (isLoading) return (
    <Box sx={{ margin: 4 }}> 
      <CircularProgress />
    </Box>
  );

  // onClick deleteIcon
  const handleDelete = (id) => {
    // delete
    deleteDocument(id).then(() => {
      setFeedback(`Document has been deleted successfully.`);
      setFeedbackType('success');
      // Remove the document from the UI
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocuments);
      //refetch the data from the server
      mutate(`${url}/documents`);
    }).catch((error) => {
      setFeedback(`${error}`);
      setFeedbackType('error');
    });
  };

  const handleEditClick = (id) => {
    router.push(`/document/edit/?id=${id}`);
  };

  const styleSecondary = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineClamp: '2',
    maxWidth: '90%',
    marginInlineEnd: '48px',
    padding: '5px'
  }

  return (
    <Box sx={{ margin: 4 }}>
      <Typography sx={{ marginTop: 4, marginBottom: 2 }} variant="h6" component="div">
        Documents
      </Typography>
      <FeedbackAlert feedback={feedback} feedbackType={feedbackType} />
      {documents.map(({ id, title, content }) => (
        <List key={id}>
          <ListItem
            secondaryAction={
              <Box>
                <Tooltip title="Edit">
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(id)} sx={{ marginRight: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <DescriptionRoundedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link href={`/document/edit/?id=${id}`} underline="none">
                  {title}
                </Link>
              }
              secondary={content}
              secondaryTypographyProps={{style: styleSecondary}}
            />
          </ListItem>
        </List>
      ))}
    </Box>
  );
}
