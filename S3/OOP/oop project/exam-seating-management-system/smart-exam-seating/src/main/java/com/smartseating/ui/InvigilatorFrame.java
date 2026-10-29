package com.smartseating.ui;

import com.smartseating.dao.*;
import com.smartseating.model.*;
import com.smartseating.service.PrintService;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;

public class InvigilatorFrame extends AppFrame {
    private final JComboBox<Exam> exams=new JComboBox<>();private final JTextArea output=new JTextArea();
    public InvigilatorFrame(User user){super("Invigilator Duty List",user);UI.frame(this,850,620);build();load();}
    private void build(){content.add(title("Invigilator Duty List"),BorderLayout.NORTH);JPanel top=new JPanel(new BorderLayout(10,0));top.setBackground(Color.WHITE);top.setBorder(BorderFactory.createEmptyBorder(8,8,8,8));top.add(new JLabel("Exam"),BorderLayout.WEST);top.add(exams,BorderLayout.CENTER);JButton view=button("VIEW",UI.BLUE);top.add(view,BorderLayout.EAST);content.add(top,BorderLayout.NORTH);output.setFont(new Font("Monospaced",Font.PLAIN,13));output.setEditable(false);content.add(white(UI.scroll(output)),BorderLayout.CENTER);JButton print=button("PRINT INVIGILATOR LIST",UI.ORANGE);JPanel bottom=new JPanel(new FlowLayout(FlowLayout.LEFT));bottom.setOpaque(false);bottom.add(print);content.add(bottom,BorderLayout.SOUTH);view.addActionListener(e->showResult());print.addActionListener(e->PrintService.print("Invigilator Duty List",output.getText()));exams.addActionListener(e->showResult());}
    private void load(){try{for(Exam e:new ExamDAO().findAll())exams.addItem(e);}catch(Exception ex){error(ex);}}
    private void showResult(){try{Exam e=(Exam)exams.getSelectedItem();if(e==null)return;StringBuilder b=new StringBuilder("SMART EXAM SEATING ARRANGEMENT SYSTEM\n================================================\nINVIGILATOR DUTY LIST\nExam: "+e.getName()+"\nDate: "+DateUtil.examDate(e)+"    Time: "+DateUtil.examTime(e)+"\n\nRoom       Teacher                         Designation\n");for(String[] row:new InvigilatorDAO().findByExam(e.getId()))b.append(String.format("%-10s %-31s %s%n",row[0],row[1],row[2]));output.setText(b.toString());}catch(Exception ex){error(ex);}}
}
