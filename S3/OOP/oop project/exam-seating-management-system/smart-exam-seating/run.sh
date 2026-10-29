#!/bin/bash
sudo systemctl start mysql
export SMART_SEATING_DB_USER=seating
export SMART_SEATING_DB_PASSWORD=seating123
mvn -q exec:java
