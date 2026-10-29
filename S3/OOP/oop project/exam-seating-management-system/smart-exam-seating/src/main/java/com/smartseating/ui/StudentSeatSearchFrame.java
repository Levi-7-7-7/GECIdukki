package com.smartseating.ui;

import com.smartseating.dao.SeatingDAO;
import com.smartseating.model.Exam;
import com.smartseating.model.Seating;
import com.smartseating.service.PrintService;
import com.smartseating.model.User;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;

public class StudentSeatSearchFrame extends AppFrame {
    private final JTextField register=new JTextField();private final JTextArea result=new JTextArea();private Seating found;
    public StudentSeatSearchFrame(User user){super("Student Seat Search",user);UI.frame(this,780,600);build();}
    private void build(){content.add(title("Student Seat Search"),BorderLayout.NORTH);JPanel search=new JPanel(new BorderLayout(8,0));search.setBackground(Color.WHITE);search.setBorder(BorderFactory.createEmptyBorder(12,12,12,12));search.add(new JLabel("Register Number"),BorderLayout.WEST);search.add(register,BorderLayout.CENTER);JButton go=button("SEARCH",UI.BLUE);search.add(go,BorderLayout.EAST);content.add(search,BorderLayout.NORTH);result.setFont(new Font("Monospaced",Font.PLAIN,13));result.setEditable(false);result.setMargin(new Insets(20,22,20,22));content.add(white(UI.scroll(result)),BorderLayout.CENTER);JButton print=button("PRINT STUDENT SEAT",UI.ORANGE);JPanel bottom=new JPanel(new FlowLayout(FlowLayout.LEFT));bottom.setOpaque(false);bottom.add(print);content.add(bottom,BorderLayout.SOUTH);go.addActionListener(e->search());register.addActionListener(e->search());print.addActionListener(e->{if(found==null){error(new IllegalArgumentException("Search for a student first."));return;}PrintService.print("Student Seat Details",result.getText());});}
    private void search(){try{found=new SeatingDAO().findByStudent(Validation.text(register.getText(),"Register number"));if(found==null){result.setText("No saved seating found for this register number. Generate an arrangement first.");return;}Exam exam=new com.smartseating.dao.ExamDAO().findById(found.getExamId());result.setText("================================================\nEXAM SEAT DETAILS\n================================================\nRegister No : "+found.getRegisterNumber()+"\nName       : "+found.getStudentName()+"\nDepartment : "+found.getDepartmentCode()+"\nSemester   : "+found.getSemesterNumber()+"\n\nExam       : "+(exam==null?"":exam.getName())+"\nDate       : "+(exam==null?"":DateUtil.examDate(exam))+"\nTime       : "+(exam==null?"":DateUtil.examTime(exam))+"\nRoom       : "+found.getRoomNumber()+"\nSeat       : "+found.getSeatNumber()+"\nInvigilator: "+found.getInvigilatorName()+"\n================================================\n");}catch(Exception ex){error(ex);}}
}
