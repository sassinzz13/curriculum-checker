SELECT fk.name AS constraint_name,
       tp.name AS parent_table,
       ref.name AS referenced_table
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables ref ON fk.referenced_object_id = ref.object_id
WHERE ref.name = 'django_content_type';
