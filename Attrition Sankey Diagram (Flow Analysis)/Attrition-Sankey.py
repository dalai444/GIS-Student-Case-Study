"""
Insurance Industry Workforce Attrition - 5-Year Sankey Diagram
Generates a flow diagram showing workforce retention and attrition over 5 years.
Each year: 3.3% retirements, 1% quits/transfers, 95.7% retained (applied to start-of-year workforce).
"""

import plotly.graph_objects as go

# Constants
INITIAL_WORKFORCE = 2_980_000
RETIREMENT_RATE = 0.033
QUIT_RATE = 0.01
YEARS = 5

# 5-year simulation
workforce = INITIAL_WORKFORCE
source = []
target = []
value = []
link_colors = []

# Node indices: 0 = Workforce; for each year y: base=1+3*(y-1), nodes are [Retained, Retirements, Quits]
node_labels = ["Workforce (2.98M)"]
node_x = [0.01]
node_y = [0.15]  # Align with Retained blocks (same level as green flow)

# Link colors: Green (Retained), Red (Retirements), Orange (Quits)
COLOR_RETAINED = "rgba(44, 160, 44, 0.6)"    # #2CA02C
COLOR_RETIREMENTS = "rgba(214, 39, 40, 0.6)"  # #D62728
COLOR_QUITS = "rgba(255, 127, 14, 0.6)"      # #FF7F0E

for year in range(1, YEARS + 1):
    retirements = int(workforce * RETIREMENT_RATE)
    quits = int(workforce * QUIT_RATE)
    retained = workforce - retirements - quits

    # Source: Workforce (year 1) or prior Retained (years 2-5)
    src = 0 if year == 1 else 1 + 3 * (year - 2)

    # Target indices for this year
    base = 1 + 3 * (year - 1)
    tgt_retained = base
    tgt_retirements = base + 1
    tgt_quits = base + 2

    source.extend([src, src, src])
    target.extend([tgt_retained, tgt_retirements, tgt_quits])
    value.extend([retained, retirements, quits])
    link_colors.extend([COLOR_RETAINED, COLOR_RETIREMENTS, COLOR_QUITS])

    # Node labels and positions for this year
    x_col = 0.01 + (year / YEARS) * 0.98
    node_labels.extend([
        f"Retained Y{year}",
        f"Retirements Y{year}",
        f"Quits Y{year}",
    ])
    # Vertical order: Retained (bottom), Quits (middle), Retirements (top)
    node_x.extend([x_col, x_col, x_col])
    node_y.extend([0.15, 0.5, 0.85])

    workforce = retained

fig = go.Figure(
    data=[
        go.Sankey(
            arrangement="snap",
            node=dict(
                pad=25,
                thickness=25,
                line=dict(color="black", width=0.5),
                label=node_labels,
                color="rgba(100, 149, 237, 0.4)",
                x=node_x,
                y=node_y,
            ),
            link=dict(
                source=source,
                target=target,
                value=value,
                color=link_colors,
            ),
        )
    ]
)

fig.update_layout(
    title=dict(
        text="The Leaking Bucket: 5-Year Insurance Workforce Attrition",
        font=dict(size=20),
        x=0.5,
        xanchor="center",
    ),
    font=dict(size=14),
    paper_bgcolor="white",
    plot_bgcolor="white",
    height=700,
    margin=dict(t=80, b=60, l=80, r=80),
)

# Save as HTML
output_path = "insurance_workforce_attrition_sankey.html"
fig.write_html(output_path)
print(f"Sankey diagram saved to: {output_path}")
