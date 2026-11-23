import { ValueError } from "../errors.js"

export class Category {
    constructor(id, name) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new ValueError("Category name cannot be empty");
        }

        this.id = id;
        this.name = name;

    
    }
}