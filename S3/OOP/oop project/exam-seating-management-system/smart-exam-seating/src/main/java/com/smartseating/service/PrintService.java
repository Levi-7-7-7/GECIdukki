package com.smartseating.service;

import javax.print.PrintException;
import java.awt.*;
import java.awt.print.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class PrintService {
    private PrintService() { }
    public static void print(String title,String body){PrinterJob job=PrinterJob.getPrinterJob();job.setJobName("Smart Seating - "+title);job.setPrintable(new ReportPrintable(title,body));if(job.printDialog())try{job.print();}catch(PrinterException ex){throw new IllegalStateException("Printing failed: "+ex.getMessage(),ex);}}
    private static final class ReportPrintable implements Printable{
        private final String title,body;
        ReportPrintable(String title,String body){this.title=title;this.body=body;}
        public int print(Graphics graphics,PageFormat pageFormat,int pageIndex){String[] lines=body.replace("\r","").split("\n",-1);int perPage=52;int start=pageIndex*perPage;if(start>=lines.length)return NO_SUCH_PAGE;Graphics2D g=(Graphics2D)graphics;g.translate(pageFormat.getImageableX(),pageFormat.getImageableY());g.setColor(Color.BLACK);g.setFont(new Font("SansSerif",Font.BOLD,16));g.drawString("SMART EXAM SEATING ARRANGEMENT SYSTEM",0,20);g.setFont(new Font("SansSerif",Font.BOLD,13));g.drawString(title,0,42);g.setFont(new Font("Monospaced",Font.PLAIN,9));int y=64;for(int i=start;i<Math.min(start+perPage,lines.length);i++){String line=lines[i];for(String wrapped:wrap(line,112)){g.drawString(wrapped,0,y);y+=14;}}g.setFont(new Font("SansSerif",Font.PLAIN,9));g.drawString("Generated: "+LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),0,(int)pageFormat.getImageableHeight()-18);g.drawString("Page "+(pageIndex+1), (int)pageFormat.getImageableWidth()-45,(int)pageFormat.getImageableHeight()-18);return PAGE_EXISTS;}
        private java.util.List<String> wrap(String value,int max){java.util.List<String> out=new java.util.ArrayList<>();if(value.length()<=max){out.add(value);return out;}for(int i=0;i<value.length();i+=max)out.add(value.substring(i,Math.min(i+max,value.length())));return out;}
    }
}
