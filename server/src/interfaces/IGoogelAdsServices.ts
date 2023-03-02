export default interface IGoogelAdsServices {
    
    listAccessibleCustomers(token: string): Promise<any>
}