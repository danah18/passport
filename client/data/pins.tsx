export type Location = {
  latitude: number,
  longitude: number
}
    
export type DisplayName = {
  text: string,
  languageCode: string
}
    
export type Photo = {
  name: string // photo resource name
  widthPx: number,
  heightPx: number
}

export type GooglePlace = {
  id: string,
  types: string[], // can use these categories for filtering
  formattedAddress: string,
  location:Location,
  rating: number,
  googleMapsUri: string,
  userRatingCount: number,
  displayName: string,
  photos: Photo[]
}

export type GooglePlaceResponse = {
    places: GooglePlace[]
}