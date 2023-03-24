export default interface IGoogelAdsServices {
    
    listCustomers(token: string): Promise<any>

    listAccessibleCustomers(token: string): Promise<any>
}