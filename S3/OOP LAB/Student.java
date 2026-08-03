// Parent class
class Person {
    String name;

    // Parent constructor
    Person(String name) {
        this.name = name;   // 'this' refers to the current object's variable
    }

    void display() {
        System.out.println("Name: " + name);
    }
}

// Child class
public class Student extends Person {
    int rollNo;

    // Child constructor
    Student(String name, int rollNo) {
        super(name);          // Calls the parent constructor
        this.rollNo = rollNo; // 'this' refers to the current object's variable
    }

    void showDetails() {
        super.display(); // Calls the parent class method
        System.out.println("Roll No: " + this.rollNo);
    }

    public static void main(String[] args) {
        Student s = new Student("Lijo", 101);
        s.showDetails();
    }
}