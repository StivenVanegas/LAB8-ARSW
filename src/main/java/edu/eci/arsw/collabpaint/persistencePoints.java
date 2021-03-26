package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class persistencePoints {
    List<Point> points = new ArrayList<>();
    public void agregarPunto(Point p) {points.add(p);}

    public List<Point> getPoints() {
        return points;
    }
}
