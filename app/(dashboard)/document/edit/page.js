import { PageContainer } from '@toolpad/core/PageContainer';
import EditDocument from './editDocument';


export default function page({ children }) {
  return (
    <PageContainer>
      <EditDocument />
    </PageContainer>
  );
}  
