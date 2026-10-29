package com.smartseating.service;

import com.smartseating.model.Student;
import java.util.*;

public class ShuffleService {
    public static final String[] OPTIONS={"No Shuffle","Random Shuffle","Register Number Ascending","Register Number Descending","Department-wise","Semester-wise","Department + Register Number","Department Mixing","Custom Shuffle"};
    public List<Student> apply(List<Student> source,String mode){List<Student> students=new ArrayList<>(source);String choice=mode==null?OPTIONS[0]:mode;Comparator<Student> register=Comparator.comparing(Student::getRegisterNumber,String.CASE_INSENSITIVE_ORDER);switch(choice){case "Random Shuffle","Custom Shuffle"->Collections.shuffle(students);case "Register Number Ascending"->students.sort(register);case "Register Number Descending"->students.sort(register.reversed());case "Department-wise"->students.sort(Comparator.comparing(Student::getDepartmentCode).thenComparing(Student::getRegisterNumber));case "Semester-wise"->students.sort(Comparator.comparing(Student::getSemesterNumber).thenComparing(Student::getRegisterNumber));case "Department + Register Number"->students.sort(Comparator.comparing(Student::getDepartmentCode).thenComparing(Student::getRegisterNumber));case "Department Mixing"->students=mix(students);default-> {}}return students;}
    /** Takes one student from every department in round-robin order until all queues are empty. */
    public List<Student> mix(List<Student> source){Map<String,Deque<Student>> groups=new TreeMap<>();for(Student s:source)groups.computeIfAbsent(s.getDepartmentCode(),k->new ArrayDeque<>()).add(s);List<Student> mixed=new ArrayList<>(source.size());boolean added=true;while(added){added=false;for(Deque<Student> q:groups.values()){Student s=q.pollFirst();if(s!=null){mixed.add(s);added=true;}}}return mixed;}
}
