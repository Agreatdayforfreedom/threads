-- this file contains the code for the thread table

CREATE TABLE IF NOT EXISTS threads(
  id int,
  threadparentid int,
  content VARCHAR(255),
  userid int,
  node_path ltree,
  FOREIGN KEY (userid) REFERENCES "user"(id)
);

-- You must create this functions manually, for now...
CREATE OR REPLACE FUNCTION get_calculated_node_path(param_id integer)
RETURNS ltree AS
$$
SELECT 
  CASE WHEN t.threadparentid IS NULL THEN 
    t.id::text::ltree 
    ELSE 
      get_calculated_node_path(t.threadparentid) || t.id::text END 
      FROM thread AS t WHERE t.id = $1;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION trig_update_node_path() RETURNS trigger AS                                                              $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
     IF(COALESCE(OLD.threadparentid, 0) != COALESCE(NEW.threadparentid) OR NEW.id != OLD.id) THEN
UPDATE thread SET node_path = get_calculated_node_path(id) WHERE OLD.node_path @> thread.node_path;
END IF;
ELSEIF TG_OP = 'INSERT' THEN
  UPDATE thread SET node_path = get_calculated_node_path(NEW.id) WHERE thread.id = NEW.id;
END IF;
RETURN NEW;
END
$$ LANGUAGE 'plpgsql' VOLATILE;


CREATE TRIGGER trig01_update_node_path AFTER INSERT OR UPDATE OF id, threadparentid
   ON thread FOR EACH ROW
   EXECUTE PROCEDURE trig_update_node_path();


-- query
 SELECT t.id, t."userId", u.username, array_to_string(
            ARRAY(SELECT CONCAT(a.id) FROM thread AS a WHERE a.node_path @> t.node_path
                                ORDER BY t.node_path)
                                        ,
                        '->') AS thread_content_uid
FROM thread AS t LEFT JOIN "user" AS u ON t."userId"=u.id
ORDER BY thread_content_uid;


WITH RECURSIVE replies AS (
  SELECT id, array[id] as spath FROM thread
  WHERE threadparentid IS NULL
  UNION ALL 
  SELECT c.id, p.spath||c.id
  FROM thread c JOIN replies p ON p.id = c.threadparentid
) SELECT id, spath FROM replies ORDER BY spath;

SELECT 
    nlevel(t.node_path) as deep, t.threadparentid, t.id, t.node_path, t.content, t.created_at, u.id as userid, u.username FROM thread t 
    LEFT JOIN "user" u ON u.id = t."userId" 
    WHERE t.node_path <@ $1 AND t.node_path <> $1;

-- INSERT 
INSERT INTO thread values(default, 7, default, 'hello 6', default, 9);
