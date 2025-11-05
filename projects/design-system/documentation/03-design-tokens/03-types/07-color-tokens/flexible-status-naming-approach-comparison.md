# Flexible Status Naming: Approach Comparison

**Document Purpose:** Strategic analysis of naming approaches for flexible status tokens in the Oblique Design System.

**Decision Context:** Evaluating whether to maintain semantic names (pending, confirmed, progress) or use color-only references (purple, teal, indigo) for flexible status tokens.

## **Executive Summary**

**Recommendation:** **Hybrid Documentation Approach** - Keep current semantic names but enhance documentation to explicitly encourage customization as the expected norm.

**Key Insight:** The choice isn't binary - we can provide semantic guidance while making customization the clearly expected and documented workflow.

---

## **Approach Comparison Matrix**

| Aspect | **Named Flexible Statuses** (Current) | **Color-Only Flexible Statuses** (Alternative) | **Hybrid Approach** (Recommended) |
|--------|---------------------------------------|------------------------------------------------|-----------------------------------|
| **Semantic Guidance** | ✅ Clear starting point | ❌ No guidance provided | ✅ Examples with adaptation guide |
| **Adoption Speed** | ✅ Immediate usage | ❌ Requires setup decisions | ✅ Fast start + easy customization |
| **Cross-Project Consistency** | ⚠️ May create false consistency | ✅ No assumptions imposed | ✅ Consistent adaptation patterns |
| **Cultural Adaptability** | ❌ Language/culture barriers | ✅ Universal colors | ✅ Localized adaptation examples |
| **Maintenance Burden** | ❌ Defend naming choices | ✅ Minimal maintenance | ⚠️ Document adaptation patterns |
| **Future-Proofing** | ❌ Workflow assumptions age | ✅ Timeless color references | ✅ Examples evolve with usage |

---

## **Detailed Analysis**

### **Current Approach: Named Flexible Statuses**

#### ✅ **Benefits:**
1. **Semantic Guidance** - Provides clear starting point for common workflows
2. **Faster Adoption** - Teams can use immediately without naming decisions  
3. **Consistency Across Projects** - Similar workflows use similar naming
4. **Documentation Value** - Clear examples of intended usage patterns
5. **Onboarding Efficiency** - New developers understand purpose quickly
6. **Design Intent Communication** - Conveys workflow-oriented thinking

#### ❌ **Downsides:**
1. **Naming Conflicts** - Teams may disagree with chosen names
2. **Workflow Assumptions** - Assumes specific business processes
3. **Cultural/Language Barriers** - Names may not translate well
4. **Maintenance Burden** - Must defend naming choices over time
5. **Rigidity Perception** - Teams may think names can't be changed
6. **Scope Creep Risk** - Pressure to add more named statuses

---

### **Alternative Approach: Color-Only Flexible Statuses**

#### ✅ **Benefits:**
1. **Maximum Flexibility** - No semantic assumptions imposed
2. **Universal Applicability** - Works across all cultures/languages
3. **Reduced Maintenance** - No naming decisions to defend
4. **Clear Customization Intent** - Obviously meant to be adapted
5. **Simpler Mental Model** - Just colors, not workflow concepts
6. **Future-Proof** - Won't become outdated with workflow changes

#### ❌ **Downsides:**
1. **No Semantic Guidance** - Teams start from scratch each time
2. **Slower Adoption** - Requires naming/semantic decisions per project
3. **Inconsistency Risk** - Different teams may use same colors differently
4. **Documentation Gap** - No clear usage examples provided
5. **Cognitive Load** - Teams must map colors to meanings themselves
6. **Missed Opportunities** - Doesn't leverage design system expertise

---

## **Industry Research Findings**

### **Named Semantic Statuses:**
- **GitHub Primer:** `open`, `closed`, `merged`, `draft`
- **Atlassian Design System:** `new`, `inprogress`, `done`, `removed`
- **ServiceNow:** `critical`, `high`, `medium`, `low`
- **Jira:** `todo`, `inprogress`, `done`, `blocked`

### **Color-Only Systems:**
- **Tailwind CSS:** `red`, `blue`, `green`, `yellow`, `purple`
- **Material Design:** Color palette without semantic constraints
- **Ant Design:** Mixed approach (semantic + color options)

### **Hybrid Systems:**
- **Chakra UI:** Provides semantic defaults with color override options
- **Carbon Design System:** Status indicators with customization guidance

---

## **Recommended Solution: Enhanced Hybrid Approach**

### **Core Strategy:**
**Position semantic names as examples rather than requirements** while making customization the expected and documented norm.

### **Implementation:**

#### **Enhanced Table Structure:**
```markdown
### **Flexible Statuses (Workflow Examples)**
Status tokens that **serve as workflow examples** and **should be renamed** to match project requirements.

| Default Name | Color Family | Workflow Examples | Common Adaptations |
|--------------|--------------|-------------------|-------------------|
| **pending** | Purple | Workflow queues | `review`, `waiting`, `queued`, `draft`, `todo` |
| **confirmed** | Teal | Verification states | `approved`, `verified`, `accepted`, `valid`, `assigned` |
| **progress** | Indigo | Active work | `inprogress`, `active`, `working`, `processing`, `doing` |
| **scheduled** | Pink | Future items | `planned`, `upcoming`, `future`, `backlog`, `later` |
| **waiting** | Gray-neutral | Blocked items | `blocked`, `paused`, `held`, `deferred`, `stuck` |
| **closed** | Gray-muted | Archive states | `archived`, `completed`, `finished`, `done`, `resolved` |
```

#### **Domain-Specific Examples:**
```markdown
**Real-World Adaptation Examples:**

**Jira/Agile Team:**
- `pending` → `todo` (Purple: Tasks ready to start)
- `progress` → `inprogress` (Indigo: Active development)  
- `confirmed` → `review` (Teal: Code review phase)
- `closed` → `done` (Gray: Completed tasks)

**Support/Helpdesk:**
- `pending` → `open` (Purple: New tickets)
- `confirmed` → `assigned` (Teal: Agent assigned)
- `progress` → `investigating` (Indigo: Active diagnosis)
- `closed` → `resolved` (Gray: Issue resolved)

**HR/Recruitment:**
- `pending` → `applied` (Purple: Application received)
- `confirmed` → `interviewed` (Teal: Interview completed)
- `progress` → `reviewing` (Indigo: Under review)
- `closed` → `hired` (Gray: Hiring decision made)

**Government/Compliance:**
- `pending` → `submitted` (Purple: Application submitted)
- `confirmed` → `verified` (Teal: Documents verified)
- `progress` → `processing` (Indigo: Under review)
- `closed` → `approved` (Gray: Decision issued)
```

#### **Token Implementation Note:**
```markdown
**Technical Implementation:**
Tokens remain stable regardless of semantic mapping:
- `ob.s.color.status.pending.*` can represent any purple semantic meaning
- `ob.s.color.status.confirmed.*` can represent any teal semantic meaning
- Color values and contrast ratios remain unchanged during remapping
```

---

## **Benefits of Hybrid Approach**

### **For Design System Maintainers:**
- ✅ **Preserves design system expertise** in workflow patterns
- ✅ **Provides valuable starting points** without imposing constraints
- ✅ **Maintains token stability** during semantic adaptations
- ✅ **Reduces support burden** through clear adaptation guidance

### **For Project Teams:**
- ✅ **Faster initial setup** with working examples
- ✅ **Clear customization path** with documented patterns
- ✅ **Cultural adaptation support** through diverse examples
- ✅ **Technical stability** during semantic changes

### **For Long-term Maintenance:**
- ✅ **Evolutionary documentation** that improves with real usage
- ✅ **Reduced naming conflicts** through explicit adaptation expectation
- ✅ **Community contributions** of adaptation patterns
- ✅ **Future-proof architecture** supporting diverse workflows

---

## **Implementation Timeline**

### **Phase 1: Documentation Enhancement** (Immediate)
1. Update flexible status table with "Common Adaptations" column
2. Add domain-specific adaptation examples
3. Emphasize customization as expected workflow
4. Update developer guidelines

### **Phase 2: Community Examples** (Ongoing)
1. Collect real-world adaptations from teams
2. Document successful adaptation patterns
3. Create domain-specific quick-start guides
4. Build adaptation example library

### **Phase 3: Tooling Support** (Future)
1. Consider token customization utilities
2. Develop adaptation validation scripts
3. Create semantic mapping documentation tools
4. Build usage analytics for pattern optimization

---

## **Decision Rationale**

The **Hybrid Approach** provides the optimal balance because:

1. **Respects team autonomy** while providing valuable guidance
2. **Leverages design system expertise** without imposing constraints  
3. **Supports diverse use cases** through documented adaptation patterns
4. **Maintains technical stability** while enabling semantic flexibility
5. **Creates learning opportunities** through shared adaptation examples
6. **Reduces decision paralysis** by providing concrete starting points

This approach transforms potential naming conflicts into collaborative improvement opportunities while maintaining the technical and visual consistency that makes design systems valuable.

---

## **Conclusion**

The **Enhanced Hybrid Approach** keeps the current semantic names while explicitly positioning them as adaptable examples rather than fixed requirements. This strategy:

- **Maximizes adoption speed** through immediate usability
- **Encourages customization** through clear documentation
- **Builds community knowledge** through shared adaptation patterns  
- **Maintains system stability** through consistent token architecture
- **Supports diverse workflows** without imposing specific processes

**Next Step:** Implement Phase 1 documentation enhancements to transform perception from "fixed naming" to "adaptable examples."