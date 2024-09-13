import { PageContainer } from '@toolpad/core/PageContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';


export default function page({ children }) {
  return (
    <PageContainer>
      <Paper square>
        <textarea style={{width: '100%', height: '100%', border: 'none',outline: 'none', padding: '1em'}}></textarea>
      </Paper>
    </PageContainer>
  );
}  
