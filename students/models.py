# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Students(models.Model):
    studentid = models.CharField(db_column='StudentID', primary_key=True, max_length=9)  # Field name made lowercase.
    firstname = models.CharField(db_column='FirstName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    lastname = models.CharField(db_column='LastName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    middlename = models.CharField(db_column='MiddleName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    enrollmentyear = models.IntegerField(db_column='EnrollmentYear', blank=True, null=True)  # Field name made lowercase.
    curriculumid = models.IntegerField(db_column='CurriculumID', blank=True, null=True)  # Field name made lowercase.
    curriculum = models.CharField(db_column='Curriculum', max_length=100, blank=True, null=True)  # Field name made lowercase.
    studentnumber = models.BigIntegerField(db_column='StudentNumber')  # Field name made lowercase.

    

    class Meta:
        managed = False
        db_table = 'Students'



class Subject(models.Model):
    subjectcode = models.CharField(db_column='SubjectCode', primary_key=True, max_length=10)  # Field name made lowercase.
    subjecttitle = models.CharField(db_column='SubjectTitle', max_length=100, blank=True, null=True)  # Field name made lowercase.
    units = models.IntegerField(db_column='Units', blank=True, null=True)  # Field name made lowercase.
    prerequisite = models.CharField(db_column='Prerequisite', max_length=10, blank=True, null=True)  # Field name made lowercase.
    semester = models.CharField(db_column='Semester', max_length=30, blank=True, null=True)  # Field name made lowercase.
    yearlevel = models.IntegerField(db_column='YearLevel', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Subject'

# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Grade(models.Model):
    studentid = models.OneToOneField('Students', models.DO_NOTHING, db_column='StudentID', primary_key=True)  # Field name made lowercase. The composite primary key (StudentID, SubjectCode) found, that is not supported. The first column is selected.
    subjectcode = models.ForeignKey('Subject', models.DO_NOTHING, db_column='SubjectCode')  # Field name made lowercase.
    grade = models.DecimalField(db_column='Grade', max_digits=3, decimal_places=2)  # Field name made lowercase.
    dateassigned = models.DateField(db_column='DateAssigned')  # Field name made lowercase.
    gradestatus = models.CharField(db_column='GradeStatus', max_length=10)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Grade'
        unique_together = (('studentid', 'subjectcode'),)
