package com.smartseating.ui;

import com.smartseating.service.PrintService;
import com.smartseating.model.User;
import com.smartseating.util.*;
import javax.swing.*;
import java.awt.*;

public class SettingsFrame extends AppFrame {
    private final JLabel status=new JLabel("Not tested");
    public SettingsFrame(User user){super("Settings",user);UI.frame(this,700,500);build();}
    private void build(){content.add(title("Application Settings"),BorderLayout.NORTH);JPanel form=UI.formPanel();JTextArea info=new JTextArea("JDBC configuration is intentionally kept outside the UI.\n\nSystem properties (highest priority):\n  -Ddb.url -Ddb.user -Ddb.password\n\nEnvironment variables:\n  SMART_SEATING_DB_URL\n  SMART_SEATING_DB_USER\n  SMART_SEATING_DB_PASSWORD\n\nDefault database: smart_exam_seating on localhost:3306\n\nRestart the application after changing configuration.");info.setEditable(false);info.setFont(new Font("Monospaced",Font.PLAIN,12));info.setBackground(Color.WHITE);GridBagConstraints g=new GridBagConstraints();g.gridx=0;g.gridy=0;g.gridwidth=2;g.fill=GridBagConstraints.BOTH;g.weightx=1;g.weighty=1;g.insets=new Insets(6,6,6,6);form.add(info,g);status.setFont(new Font("SansSerif",Font.BOLD,14));UI.addField(form,1,"Connection status",status);JPanel buttons=new JPanel(new FlowLayout(FlowLayout.LEFT));buttons.setOpaque(false);JButton test=button("TEST CONNECTION",UI.BLUE),print=button("PRINT",UI.ORANGE);buttons.add(test);buttons.add(print);g.gridy=2;g.weighty=0;form.add(buttons,g);content.add(white(form),BorderLayout.CENTER);test.addActionListener(e->{status.setText(DBConnection.isAvailable()?"CONNECTED":"NOT CONNECTED");status.setForeground(DBConnection.isAvailable()?UI.TEAL:new Color(190,66,66));});print.addActionListener(e->PrintService.print("Settings and Connection Status",info.getText()+"\n\nConnection status: "+status.getText()));}
}
