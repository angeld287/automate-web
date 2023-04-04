export default interface IOpenaiServices {
    createNewImage(text: string): Promise<any>;
}