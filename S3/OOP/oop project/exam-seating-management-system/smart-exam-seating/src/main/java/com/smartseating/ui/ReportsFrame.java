package com.smartseating.ui;

import com.smartseating.dao.*;
import com.smartseating.model.*;
import com.smartseating.service.PrintService;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;
import java.util.List;
import java.util.stream.Collectors;

public class ReportsFrame extends AppFrame {
    private final JComboBox<Exam> exams=new JComboBox<>();private final JTextField department=new JTextField(),semester=new JTextField(),room=new JTextField(),teacher=new JTextField();private final JTextArea output=new JTextArea();
    public ReportsFrame(User user){super("Seating Reports",user);UI.frame(this,1100,720);build();load();}
    private void build(){content.add(title("Reports • Filters and Complete Exam View"),BorderLayout.NORTH);JPanel filters=UI.formPanel();UI.addField(filters,0,"Exam",exams);UI.addField(filters,1,"Department filter",department);UI.addField(filters,2,"Semester filter",semester);UI.addField(filters,3,"Room filter",room);UI.addField(filters,4,"Teacher filter",teacher);JPanel a=new JPanel(new FlowLayout(FlowLayout.LEFT));a.setOpaque(false);JButton view=button("VIEW",UI.BLUE),print=button("PRINT",UI.ORANGE),export=button("EXPORT TEXT",UI.TEAL);a.add(view);a.add(print);a.add(export);GridBagConstraints g=new GridBagConstraints();g.gridx=0;g.gridy=5;g.gridwidth=2;g.fill=GridBagConstraints.HORIZONTAL;filters.add(a,g);content.add(white(filters),BorderLayout.WEST);output.setFont(new Font("Monospaced",Font.PLAIN,12));output.setEditable(false);content.add(white(UI.scroll(output)),BorderLayout.CENTER);view.addActionListener(e->view());print.addActionListener(e->PrintService.print("Complete Examination Report",output.getText()));export.addActionListener(e->export());exams.addActionListener(e->view());}
    private void load(){try{for(Exam e:new ExamDAO().findAll())exams.addItem(e);}catch(Exception ex){error(ex);}}
    private void view(){try{Exam e=(Exam)exams.getSelectedItem();if(e==null)return;List<Seating> list=new SeatingDAO().findByExam(e.getId());String d=department.getText().trim().toLowerCase(),s=semester.getText().trim().toLowerCase(),r=room.getText().trim().toLowerCase(),t=teacher.getText().trim().toLowerCase();list=list.stream().filter(x->d.isBlank()||x.getDepartmentCode().toLowerCase().contains(d)).filter(x->s.isBlank()||x.getSemesterNumber().toLowerCase().contains(s)).filter(x->r.isBlank()||x.getRoomNumber().toLowerCase().contains(r)).filter(x->t.isBlank()||x.getInvigilatorName().toLowerCase().contains(t)).toList();StringBuilder b=new StringBuilder("SMART EXAM SEATING ARRANGEMENT SYSTEM\n================================================\nCOMPLETE EXAMINATION REPORT\nExam: "+e.getName()+"\nType: "+e.getType()+"\nDate: "+DateUtil.examDate(e)+"    Time: "+DateUtil.examTime(e)+"\nSubject: "+e.getSubject()+"\nStudents in filter: "+list.size()+"\nDepartments: "+list.stream().map(Seating::getDepartmentCode).distinct().sorted().collect(Collectors.joining(", "))+"\nSemesters: "+list.stream().map(Seating::getSemesterNumber).distinct().sorted().collect(Collectors.joining(", "))+"\n\nRoom       Seat       Register No       Name                         Department   Teacher\n");for(Seating x:list)b.append(String.format("%-10s %-10s %-18s %-29s %-12s %s%n",x.getRoomNumber(),x.getSeatNumber(),x.getRegisterNumber(),x.getStudentName(),x.getDepartmentCode(),x.getInvigilatorName()));output.setText(b.toString());}catch(Exception ex){error(ex);}}
    private void export(){try{JFileChooser chooser=new JFileChooser();chooser.setSelectedFile(new java.io.File("exam-report.txt"));if(chooser.showSaveDialog(this)==JFileChooser.APPROVE_OPTION)java.nio.file.Files.writeString(chooser.getSelectedFile().toPath(),output.getText());}catch(Exception ex){error(ex);}}
}
