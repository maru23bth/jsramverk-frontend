import { PageContainer } from '@toolpad/core/PageContainer';
import CreateDocumentForm from '@/app/components/createDocumentForm';


export default function page({ children }) {
  return (
    <PageContainer>
      <CreateDocumentForm />
    </PageContainer>
  );
}  
