export const getAllBannersQuery = `
  *[_type == "banners" && isActive == true] | order(order asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    image {
      asset {
        _ref,
        _type
      },
      hotspot,
      crop,
      alt,
      _type
    },
    link,
    isActive,
    order
  }
`;