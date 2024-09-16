import { PageContainer } from '@toolpad/core/PageContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MyForm from './myForm';


export default function page({ children }) {
  return (
    <PageContainer>
      <MyForm />
    </PageContainer>
  );
}  
