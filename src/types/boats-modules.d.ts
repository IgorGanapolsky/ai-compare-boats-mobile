declare module '@boats/core' {
  export function analyzeBoatImage(imageUri: string): Promise<any>;
  // Add other exported functions as needed
}

declare module '@boats/api' {
  export function getBoatDetails(imageData: any): Promise<any>;
  // Add other exported functions as needed
}

declare module '@boats/types' {
  export interface BoatTypes {
    type: string;
    make: string;
    model: string;
    year: number;
    // Add other properties as needed
  }
  // Add other exported interfaces as needed
}
