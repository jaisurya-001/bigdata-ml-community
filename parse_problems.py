import json
import re
import os

transcript_path = r"C:\Users\madha\.gemini\antigravity-ide\brain\7a265d9e-c224-4323-afca-688e21d31447\.system_generated\logs\transcript_full.jsonl"

pdf_content = ""
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if '==Start of PDF==' in line:
            data = json.loads(line)
            content = data.get('content', '')
            if '==Start of PDF==' in content:
                start_idx = content.find('==Start of PDF==')
                end_idx = content.find('==End of PDF==')
                if end_idx != -1:
                    pdf_content = content[start_idx:end_idx]
                else:
                    pdf_content = content[start_idx:]
                break

if not pdf_content:
    print("Could not find PDF content in transcript.")
    exit(1)

# Now parse the pdf_content
problems = []
# split by "Problem Statement "
parts = pdf_content.split("Problem Statement ")
for i in range(1, len(parts)):
    part = parts[i]
    
    # The first line or token should be the number
    match = re.search(r'^(\d+)', part)
    if not match:
        continue
    ps_number = f"PS-{int(match.group(1)):02d}"
    
    # Title is the next line
    lines = [line.strip() for line in part.split('\n') if line.strip()]
    if len(lines) > 1:
        title = lines[1]
    else:
        title = "Unknown"
        
    # Domain is roughly before Problem Statement, but let's just assign based on PS number
    ps_num_int = int(match.group(1))
    if ps_num_int <= 10: domain = "Smart Education & Student Analytics"
    elif ps_num_int <= 20: domain = "Healthcare & Wellness Analytics"
    elif ps_num_int <= 30: domain = "Smart Agriculture & Environment"
    elif ps_num_int <= 40: domain = "Smart Business & Finance"
    else: domain = "Smart City & Transportation"

    description = ""
    reqs = []
    pipeline = ""
    outcomes = []
    
    desc_match = re.search(r'Problem Description(.*?)(?=Expected Outcome|$)', part, re.DOTALL | re.IGNORECASE)
    if desc_match:
        description = desc_match.group(1).strip()
    
    reqs_start = part.find('The system should:')
    reqs_end = part.find('Pipeline:')
    if reqs_start != -1 and reqs_end != -1:
        reqs_text = part[reqs_start+18:reqs_end].strip()
        reqs = [r.strip().replace('● ', '') for r in reqs_text.split('\n') if r.strip() and r.strip().startswith('●')]
        
    pipeline_match = re.search(r'Pipeline:\s*(.*?)(?=\n\s*Problem Description|$)', part, re.IGNORECASE | re.DOTALL)
    if pipeline_match:
        pipeline = pipeline_match.group(1).strip().replace('\n', ' ')

    outcome_match = re.search(r'Expected Outcome(.*?)(?=Deliverable\s*Expected Output|$)', part, re.DOTALL | re.IGNORECASE)
    table_match = re.search(r'Deliverable\s*Expected Output(.*)', part, re.DOTALL)
    if table_match:
        table_text = table_match.group(1).strip()
        # Parse table roughly
        for row in table_text.split('\n'):
            if '==' in row or 'Deliverable' in row or row.strip() == '':
                continue
            # Try to split by first capital word
            m = re.match(r'^([A-Za-z\s]+?)\s+([A-Z].*)$', row.strip())
            if m:
                outcomes.append({"component": m.group(1).strip(), "output": m.group(2).strip()})
            else:
                outcomes.append({"component": "Task", "output": row.strip()})
    
    problems.append({
        "id": ps_number,
        "title": title,
        "domain": domain,
        "description": description,
        "requirements": reqs,
        "pipeline": pipeline,
        "expected_outcomes": outcomes
    })

os.makedirs(r"c:\Users\madha\Documents\projects\bigdata-project\server\data", exist_ok=True)
with open(r"c:\Users\madha\Documents\projects\bigdata-project\server\data\problems.json", 'w', encoding='utf-8') as f:
    json.dump(problems, f, indent=2)

print(f"Successfully parsed {len(problems)} problem statements.")
