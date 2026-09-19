import "./AdminDashboard.css"; 
 
function AdminDashboard() { 
  return ( 
    <div className="admin-dashboard"> 
 
      <aside className="admin-sidebar"> 
        <div className="admin-brand"> 
          BGRAND 
          <span>ADMIN</span> 
        </div> 
 
        <nav className="admin-nav"> 
          <a href="/admin/dashboard" className="active"> 
            <span>▦</span> 
            Dashboard 
          </a> 
 
          <a href="/admin/rooms"> 
            <span>⌂</span> 
            Rooms 
          </a> 
 
          <a href="/admin/bookings"> 
            <span>▣</span> 
            Bookings 
          </a> 
 
          <a href="/admin/gallery"> 
            <span>▧</span> 
            Gallery 
          </a> 
 
          <a 
            href="/admin/guests" 
            onClick={(e) => { 
              e.preventDefault(); 
              window.location.assign("/admin/guests"); 
            }} 
          > 
            <span>♙</span> 
            Guests 
          </a> 
 
          <a href="/admin/settings"> 
            <span>⚙</span> 
            Settings 
          </a> 
        </nav> 
 
        <a href="/admin" className="admin-logout"> 
          ← Logout 
        </a> 
      </aside> 
 
      <main className="admin-main"> 
 
        <header className="admin-topbar"> 
          <div> 
            <p>ADMINISTRATION</p> 
            <h1>Dashboard</h1> 
          </div> 
 
          <div className="admin-profile"> 
            <div className="admin-avatar">A</div> 
            <div> 
              <strong>Administrator</strong> 
              <span>Admin</span> 
            </div> 
          </div> 
        </header> 
 
        <section className="dashboard-welcome"> 
          <p>WELCOME BACK</p> 
          <h2>BGRAND Management Overview</h2> 
          <span> 
            Manage your rooms, bookings, guests and property information. 
          </span> 
        </section> 
 
        <section className="dashboard-stats"> 
 
          <div className="dashboard-card"> 
            <span className="dashboard-card-icon">▣</span> 
            <p>TOTAL BOOKINGS</p> 
            <h3>24</h3> 
            <span>Current bookings</span> 
          </div> 
 
          <div className="dashboard-card"> 
            <span className="dashboard-card-icon">⌂</span> 
            <p>AVAILABLE ROOMS</p> 
            <h3>08</h3> 
            <span>Rooms available</span> 
          </div> 
 
          <div className="dashboard-card"> 
            <span className="dashboard-card-icon">♙</span> 
            <p>TOTAL GUESTS</p> 
            <h3>36</h3> 
            <span>Registered guests</span> 
          </div> 
 
          <div className="dashboard-card"> 
            <span className="dashboard-card-icon">₹</span> 
            <p>REVENUE</p> 
            <h3>₹68,500</h3> 
            <span>This month</span> 
          </div> 
 
        </section> 
 
        <section className="dashboard-content"> 
 
          <div className="dashboard-panel"> 
            <div className="panel-heading"> 
              <div> 
                <p>RECENT ACTIVITY</p> 
                <h2>Recent Bookings</h2> 
              </div> 
 
              <button 
                onClick={() => (window.location.href = "/admin/bookings")} 
              > 
                View All 
              </button> 
            </div> 
 
            <div className="booking-table"> 
 
              <div className="booking-row booking-header"> 
                <span>Guest</span> 
                <span>Room</span> 
                <span>Check-in</span> 
                <span>Status</span> 
              </div> 
 
              <div className="booking-row"> 
                <span>Rahul Kumar</span> 
                <span>Premium Suite</span> 
                <span>18 Sep 2026</span> 
                <strong className="status-confirmed"> 
                  Confirmed 
                </strong> 
              </div> 
 
              <div className="booking-row"> 
                <span>Priya Sharma</span> 
                <span>Luxury Deluxe Room</span> 
                <span>19 Sep 2026</span> 
                <strong className="status-pending"> 
                  Pending 
                </strong> 
              </div> 
 
              <div className="booking-row"> 
                <span>Arjun Reddy</span> 
                <span>Executive Room</span> 
                <span>21 Sep 2026</span> 
                <strong className="status-confirmed"> 
                  Confirmed 
                </strong> 
              </div> 
 
            </div> 
          </div> 
 
          <div className="dashboard-panel quick-actions"> 
            <div className="panel-heading"> 
              <div> 
                <p>MANAGEMENT</p> 
                <h2>Quick Actions</h2> 
              </div> 
            </div> 
 
            <button 
              onClick={() => (window.location.href = "/admin/rooms")} 
            > 
              <span>+</span> 
              Add New Room 
            </button> 
 
            <button 
              onClick={() => (window.location.href = "/admin/gallery")} 
            > 
              <span>+</span> 
              Add Gallery Image 
            </button> 
 
            <button 
              onClick={() => (window.location.href = "/admin/bookings")} 
            > 
              <span>▣</span> 
              View Bookings 
            </button> 
 
          </div> 
 
        </section> 
 
      </main> 
    </div> 
  ); 
} 
 
export default AdminDashboard;