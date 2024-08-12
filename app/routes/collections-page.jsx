import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({context}) {
  const collectionsData = await context.storefront.query(COLLECTIONS_QUERY);

  return defer({
    collections: collectionsData,
  });
};

export default function Collections() {
    const {collections} = useLoaderData();
    return (
      <div className="collections">
        <h1>Our Collections</h1>
        <div className="collection-grid">
          {collections.collections.edges.map(({node}) => (
            <div key={node.id} className="collection-item">
              {node.image && (
                <img src={node.image.src} alt={node.image.altText} />
              )}
              <h2>{node.title}</h2>
              <a href={`/collections/${node.handle}`}>Посмотреть коллекцию</a>
            </div>
          ))}
        </div>
      </div>
    );
};

const COLLECTIONS_QUERY = `#graphql
  query {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          image {
            src
            altText
          }
        }
      }
    }
  }
`;
  