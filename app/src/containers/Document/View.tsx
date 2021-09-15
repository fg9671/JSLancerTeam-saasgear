import React, { useEffect } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { useLazyQuery } from '@apollo/react-hooks';
import { useRouteMatch } from 'react-router-dom';

import getDocumentDetailQuery from '@/queries/document/getDocumentDetail';
import { ContentPage, TitlePage } from '@/components/Layout/blockStyle';

const ContentDocument = styled.div`
  min-height: calc(100vh - 64px);
`

type MatchParams = {
  id: string;
}

const ViewDocument: React.FC = () => {
  const match = useRouteMatch<MatchParams>();
  const documentId = parseInt(match.params.id, 10);
  const [fetchDocumentDetail, { data: documentData, loading }] = useLazyQuery(
    getDocumentDetailQuery,
  );

  useEffect(() => {
    if (documentId) {
      fetchDocumentDetail({ variables: { id: documentId } });
    }
  }, [documentId]);

  function createMarkup(html: string) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  return (
    <ContentDocument>
      {loading && <div>Loading...</div>}

      {!loading && documentData?.getDocumentDetail && (
        <>
          <TitlePage>{documentData.getDocumentDetail.name}</TitlePage>
          <ContentPage>
            <div
              dangerouslySetInnerHTML={createMarkup(
                documentData.getDocumentDetail.body,
              )}
            ></div>
          </ContentPage>
        </>
      )}
    </ContentDocument>
  );
};

export default ViewDocument;