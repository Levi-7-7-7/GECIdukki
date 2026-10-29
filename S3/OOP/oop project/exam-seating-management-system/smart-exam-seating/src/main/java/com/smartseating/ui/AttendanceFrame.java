package com.smartseating.ui;

import com.smartseating.dao.*;
import com.smartseating.model.*;
import com.smartseating.service.PrintService;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;
import java.util.stream.Collectors;

public class AttendanceFrame extends AppFrame {
    private final JComboBox<Exam> exams=new JComboBox<>();private final JTextArea output=new JTextArea();private java.util.List<Seating> seats=java.util.List.of();
    public AttendanceFrame(User user){super("Attendance Sheet",user);UI.frame(this,1050,700);build();load();}
    private void build(){content.add(title("Room-wise Attendance Sheet"),BorderLayout.NORTH);JPanel top=new JPanel(new BorderLayout(10,0));top.setBackground(Color.WHITE);top.setBorder(BorderFactory.createEmptyBorder(8,8,8,8));top.add(new JLabel("Exam"),BorderLayout.WEST);top.add(exams,BorderLayout.CENTER);JButton view=button("VIEW",UI.BLUE);top.add(view,BorderLayout.EAST);content.add(top,BorderLayout.NORTH);output.setFont(new Font("Monospaced",Font.PLAIN,12));output.setEditable(false);content.add(white(UI.scroll(output)),BorderLayout.CENTER);JButton print=button("PRINT ATTENDANCE SHEET",UI.ORANGE);JPanel bottom=new JPanel(new FlowLayout(FlowLayout.LEFT));bottom.setOpaque(false);bottom.add(print);content.add(bottom,BorderLayout.SOUTH);view.addActionListener(e->showResult());print.addActionListener(e->PrintService.print("Attendance Sheet",output.getText()));exams.addActionListener(e->showResult());}
    private void load(){try{for(Exam e:new ExamDAO().findAll())exams.addItem(e);}catch(Exception ex){error(ex);}}
    private void showResult(){try{Exam e=(Exam)exams.getSelectedItem();if(e==null)return;seats=new SeatingDAO().findByExam(e.getId());StringBuilder b=new StringBuilder("SMART EXAM SEATING ARRANGEMENT SYSTEM\n================================================\nATTENDANCE SHEET\nExam: "+e.getName()+"\nDate: "+DateUtil.examDate(e)+"    Time: "+DateUtil.examTime(e)+"\n\n");for(String room:seats.stream().map(Seating::getRoomNumber).distinct().toList()){java.util.List<Seating> list=seats.stream().filter(s->s.getRoomNumber().equals(room)).toList();b.append("ROOM: ").append(room).append("    Invigilator: ").append(list.get(0).getInvigilatorName()).append("\nSl No | Register No       | Name                         | Signature\n");int i=1;for(Seating s:list)b.append(String.format("%-6d| %-18s| %-29s| ____________________%n",i++,s.getRegisterNumber(),s.getStudentName()));b.append("Total Students: ").append(list.size()).append("\nInvigilator Signature: ____________________\n\n");}if(seats.isEmpty())b.append("No generated seating found for this examination.\n");output.setText(b.toString());output.setCaretPosition(0);}catch(Exception ex){error(ex);}}
}
