package com.smartseating.ui;

import com.smartseating.service.PrintService;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;

public class CapacityFrame extends AppFrame {
    private final JTextField rooms=new JTextField("10"),seats=new JTextField("30"),students=new JTextField("143");private final JLabel total=new JLabel("—"),required=new JLabel("—"),remaining=new JLabel("—"),extra=new JLabel("—"),status=new JLabel("Enter values and click CALCULATE");
    public CapacityFrame(User user){super("Capacity Calculator",user);UI.frame(this,720,560);build();}
    private void build(){content.add(title("Room Capacity Calculator"),BorderLayout.NORTH);JPanel form=UI.formPanel();UI.addField(form,0,"Number of Rooms",rooms);UI.addField(form,1,"Seats Per Room",seats);UI.addField(form,2,"Total Students",students);UI.addField(form,3,"Total Capacity",total);UI.addField(form,4,"Required Rooms",required);UI.addField(form,5,"Remaining Seats",remaining);UI.addField(form,6,"Extra Capacity",extra);status.setFont(new Font("SansSerif",Font.BOLD,15));status.setForeground(UI.TEAL);GridBagConstraints g=new GridBagConstraints();g.gridx=0;g.gridy=7;g.gridwidth=2;g.insets=new Insets(15,6,10,6);g.anchor=GridBagConstraints.WEST;form.add(status,g);JPanel a=new JPanel(new FlowLayout(FlowLayout.LEFT));a.setOpaque(false);JButton calc=button("CALCULATE",UI.BLUE),print=button("PRINT",UI.ORANGE);a.add(calc);a.add(print);g.gridy=8;g.fill=GridBagConstraints.HORIZONTAL;form.add(a,g);content.add(white(form),BorderLayout.CENTER);calc.addActionListener(e->calculate());print.addActionListener(e->PrintService.print("Capacity Report",report()));}
    private void calculate(){try{int r=Validation.positive(rooms.getText(),"Number of rooms"),s=Validation.positive(seats.getText(),"Seats per room"),n=Validation.positive(students.getText(),"Total students");int cap=r*s,req=(n+s-1)/s;total.setText(String.valueOf(cap));required.setText(String.valueOf(req));remaining.setText(String.valueOf(Math.max(0,cap-n)));extra.setText(String.valueOf(Math.max(0,cap-(req*s))));if(cap>=n){status.setText("CAPACITY OK");status.setForeground(UI.TEAL);}else{status.setText("CAPACITY LOW • Additional rooms required: "+(req-r));status.setForeground(new Color(190,66,66));}}catch(Exception ex){error(ex);}}
    private String report(){return "CAPACITY REPORT\n\nRooms: "+rooms.getText()+"\nSeats per room: "+seats.getText()+"\nStudents: "+students.getText()+"\nTotal capacity: "+total.getText()+"\nRequired rooms: "+required.getText()+"\nRemaining seats: "+remaining.getText()+"\nExtra capacity: "+extra.getText()+"\nStatus: "+status.getText();}
}
