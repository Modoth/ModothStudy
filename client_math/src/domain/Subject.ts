export default class Subject {
    public id : string;
    public name : string;
    public parent? : Subject;
    public children? : Subject[]
}
