package com.smartseating.ui;

import com.smartseating.dao.RoomDAO;
import com.smartseating.model.*;
import com.smartseating.service.PrintService;
import com.smartseating.util.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class QuickRoomSetupFrame extends AppFrame {
    private final RoomDAO dao=new RoomDAO();private final JTextField start=new JTextField("101"),count=new JTextField("10"),rows=new JTextField("5"),columns=new JTextField("6"),building=new JTextField("Main Block"),floor=new JTextField("1");private final JLabel summary=new JLabel("Enter configuration and click PREVIEW");private final JTable preview=new JTable();private List<Room> generated=new ArrayList<>();
    public QuickRoomSetupFrame(User user){super("Quick Room Setup",user);UI.frame(this,900,650);build();}
    private void build(){content.add(title("Quick Room Setup • Bulk Room Creation"),BorderLayout.NORTH);JPanel form=UI.formPanel();UI.addField(form,0,"Starting Room Number",start);UI.addField(form,1,"Number of Rooms",count);UI.addField(form,2,"Rows",rows);UI.addField(form,3,"Columns",columns);UI.addField(form,4,"Building",building);UI.addField(form,5,"Floor",floor);summary.setForeground(UI.TEAL);GridBagConstraints sg=new GridBagConstraints();sg.gridx=0;sg.gridy=6;sg.gridwidth=2;sg.fill=GridBagConstraints.HORIZONTAL;sg.insets=new Insets(8,6,10,6);form.add(summary,sg);JPanel a=new JPanel(new GridLayout(2,3,7,7));a.setOpaque(false);JButton calc=button("CALCULATE",UI.BLUE),prev=button("PREVIEW",UI.TEAL),add=button("ADD ALL ROOMS",UI.ORANGE),print=button("PRINT",new Color(120,130,145)),cancel=button("CANCEL",new Color(170,75,75));for(JButton b:new JButton[]{calc,prev,add,print,cancel})a.add(b);GridBagConstraints ag=new GridBagConstraints();ag.gridx=0;ag.gridy=7;ag.gridwidth=2;ag.fill=GridBagConstraints.HORIZONTAL;ag.insets=new Insets(8,6,6,6);form.add(a,ag);content.add(white(form),BorderLayout.WEST);UI.tableStyle(preview);content.add(white(UI.scroll(preview)),BorderLayout.CENTER);calc.addActionListener(e->calculate());prev.addActionListener(e->preview());add.addActionListener(e->save());print.addActionListener(e->PrintService.print("Quick Room Setup",text()));cancel.addActionListener(e->dispose());}
    private List<Room> buildRooms(){int first=Validation.positive(start.getText(),"Starting room number"),n=Validation.positive(count.getText(),"Number of rooms"),r=Validation.positive(rows.getText(),"Rows"),c=Validation.positive(columns.getText(),"Columns"),f=Validation.positive(floor.getText(),"Floor");String b=Validation.text(building.getText(),"Building");List<Room> list=new ArrayList<>();for(int i=0;i<n;i++)list.add(new Room(0,String.valueOf(first+i),b,f,r,c,r*c,"AVAILABLE"));return list;}
    private void calculate(){try{int rooms=Validation.positive(count.getText(),"Number of rooms"),r=Validation.positive(rows.getText(),"Rows"),c=Validation.positive(columns.getText(),"Columns");summary.setText("Seats per room: "+(r*c)+"   •   Total capacity: "+(rooms*r*c)+"   •   Status: CAPACITY READY");}catch(Exception ex){error(ex);}}
    private void preview(){try{generated=buildRooms();DefaultTableModel m=new DefaultTableModel(new Object[]{"Room Number","Building","Floor","Rows","Columns","Seats"},0);for(Room r:generated)m.addRow(new Object[]{r.getRoomNumber(),r.getBuilding(),r.getFloor(),r.getRows(),r.getColumns(),r.getCapacity()});preview.setModel(m);UI.tableStyle(preview);calculate();}catch(Exception ex){error(ex);}}
    private void save(){try{if(generated.isEmpty())preview();Set<String> existing=new HashSet<>();for(Room r:dao.findAll())existing.add(r.getRoomNumber());for(Room r:generated)if(!existing.add(r.getRoomNumber()))throw new IllegalArgumentException("Duplicate room number: "+r.getRoomNumber());dao.saveAll(generated);JOptionPane.showMessageDialog(this,generated.size()+" rooms added successfully.","Rooms created",JOptionPane.INFORMATION_MESSAGE);dispose();}catch(Exception ex){error(ex);}}
    private String text(){StringBuilder b=new StringBuilder("BULK ROOM SETUP\n\n");for(Room r:generated)b.append(r.getRoomNumber()).append(" | ").append(r.getCapacity()).append(" seats | ").append(r.getBuilding()).append("\n");return b.toString();}
}
