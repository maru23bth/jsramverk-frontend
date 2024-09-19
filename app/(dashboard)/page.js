"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Tooltip, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

// Wrap the fetch API with react fetcher to get useSWR to work
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function DocumentList() {
  // router to be able to redirect between pages
  const router = useRouter();
  const url = 'https://jsramverk-maru23-dxfhbmhkbdd4e4ep.northeurope-01.azurewebsites.net';
  // Fetch data from the API during the mount of the component
  const { data, error, isLoading } = useSWR(`${url}/documents`, fetcher);
  const [documents, setDocuments] = useState([]);

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
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${url}/documents/${id}`, { method: 'DELETE' });
      if (response.ok) {
        // update the documents value, which will trigger the useEffect hook, which will update documents state
        setDocuments(documents.filter(doc => doc.id !== id));
      } else {
        console.log('Failed to delete document');
      }
    } catch (error) {
      console.log("Error deleting document:", error);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/document/edit/?id=${id}`);
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Typography sx={{ marginTop: 4, marginBottom: 2 }} variant="h6" component="div">
        Documents
      </Typography>
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
                <Link href={`/document/edit/${id}`} underline="none">
                  {title}
                </Link>
              }
              secondary={content}
            />
          </ListItem>
        </List>
      ))}
    </Box>
  );
}
