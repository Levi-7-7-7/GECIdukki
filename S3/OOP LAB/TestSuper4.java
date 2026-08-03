class Point2D {
    double x, y;

    // Default constructor
    Point2D() {
        x = 0.0;
        y = 0.0;
    }

    // Parameterized constructor
    Point2D(double x, double y) {
        this.x = x;
        this.y = y;
    }
}

class Point3D extends Point2D {
    double z;

    // Default constructor
    Point3D() {
        super();
        z = 0.0;
    }

    // Parameterized constructor
    Point3D(double x, double y, double z) {
        super(x, y);
        this.z = z;
    }
}

public class TestSuper4 {
    public static void main(String[] args) {
        Point3D p = new Point3D(2.0, 3.0, 4.0);

        System.out.println("x = " + p.x);
        System.out.println("y = " + p.y);
        System.out.println("z = " + p.z);
    }
}