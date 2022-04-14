import type { IdReference, OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, idReference, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'

export interface Product extends Thing {
  /**
   * The name of the product.
   */
  name: string
  /**
   * A reference-by-ID to one or more imageObject s which represent the product.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: IdReference|IdReference[]

  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: IdReference[] // @todo
  /**
   *  A reference to an Organization piece, representing brand associated with the Product.
   */
  brand?: IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: string
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: unknown // @todo
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: IdReference
}

export const ProductId = '#product'

/**
 * Describes an Article on a WebPage.
 */
export function defineProduct(product: OptionalMeta<Product>) {
  return defineNodeResolverSchema<Product>(product, {
    // resolveId() {
    //   const { resolvePathId } = useSchemaOrg()
    //   return resolvePathId('article', path)
    // },
    defaults: {
      '@type': 'Product',
      '@id': ProductId,
    },
    resolve(product, { routeMeta }) {
      const meta = routeMeta()

      if (meta.description)
        setIfEmpty(product, 'description', meta.description)

      return product as Product
    },
    mergeRelations(product, { findNode }) {
      const webPage = findNode(WebPageId)

      if (webPage) {
        setIfEmpty(product, 'isPartOf', idReference(webPage))
        setIfEmpty(product, 'mainEntityOfPage', idReference(webPage))
      }
      return product
    },
  })
}
