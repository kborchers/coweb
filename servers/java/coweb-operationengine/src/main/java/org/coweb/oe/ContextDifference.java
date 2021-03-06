package org.coweb.oe;

import java.util.Arrays;
import java.util.Vector;

public class ContextDifference {
	
	public Vector<Integer> sites;
	public Vector<Integer> seqs;
	
	
	public ContextDifference() {
		this.sites = new Vector<Integer>();
		this.seqs = new Vector<Integer>();
	}
	
	
	/**
     * Adds a range of operations to the difference.
     *
     * @param site Integer site ID
     * @param start First integer operation sequence number, inclusive
     * @param end Last integer operation sequence number, exclusive
     */
    public void addRange(int site, int start, int end) {
        for(int i=start; i < end; i++) {
            this.addSiteSeq(site, i);
        }
    }
    
    /**
     * Adds a single operation to the difference.
     *
     * @param site Integer site ID
     * @param seq Integer sequence number
     */
    public void addSiteSeq(int site, int seq) {
        this.sites.addElement(new Integer(site));
        this.seqs.addElement(new Integer(seq));        
    }
    
    /**
     * Gets the histor buffer keys for all the operations represented in this
     * context difference.
     *
     * @return Array of keys for HistoryBuffer lookups
     */
    public String[] getHistoryBufferKeys() {
		Vector<String> arr = new Vector<String>();
		int l = this.seqs.size();
        for(int i=0; i < l; i++) {
            String key = Operation.createHistoryKey(this.sites.elementAt(i), 
                this.seqs.elementAt(i));
            arr.addElement(key);
        }
        
        String[] strArr = new String[arr.size()];
        return arr.toArray(strArr);
	}
    
    /**
     * Converts the contents of this context difference to a string.
     *
     * @return All keys in the difference (for debug)
     */
    public String toString() {
        return Arrays.toString(this.getHistoryBufferKeys());
    }
}
